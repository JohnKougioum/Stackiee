import { PrismaClient } from "@prisma/client";
import { handleParticipantUpdateLogic } from "~/server/utils/handleParticipantUpdate";
import { sendSSEEvent } from "~/server/utils/server-events";
import { SocketEvents } from "~/types";
import z from "zod";

const prisma = new PrismaClient();

const updateParticipantsSchema = z.object({
  participantIDs: z.array(z.string()).min(1),
});

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id;
  if (!conversationID) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing conversation ID",
    });
  }

  const requestBody = await readBody(event);
  const parsed = updateParticipantsSchema.safeParse(requestBody);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid participants list",
    });
  }

  const newParticipantIds = [...new Set(parsed.data.participantIDs)].sort();

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: event.context.id.id },
    });

    const currentConversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationID },
      include: { participants: true },
    });

    const isAdmin = currentConversation.participants.some(
      (p) => p.userId === user.id && p.isAdmin
    );
    if (!isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: "Only conversation admins can update participants.",
      });
    }

    const currentParticipantIds = currentConversation.participants
      .map((p) => p.userId)
      .sort();
    const action = handleParticipantUpdateLogic({
      currentParticipants: currentParticipantIds,
      newParticipants: newParticipantIds,
      conversationId: conversationID,
    });

    if (action.action === "delete") {
      await prisma.message.deleteMany({
        where: { conversationId: currentConversation.id },
      });
      await prisma.conversationParticipant.deleteMany({
        where: { conversationId: currentConversation.id },
      });
      await prisma.conversation.delete({
        where: { id: currentConversation.id },
      });
      for (const participant of currentParticipantIds) {
        await sendSSEEvent(
          participant,
          JSON.stringify({
            type: SocketEvents.ConversationParticipantsUpdate,
            body: {
              chatId: "",
              participants: [],
            },
          })
        );
      }
      return { statusCode: 200, body: { message: "Conversation deleted." } };
    }

    if (action.action === "create") {
      const newConversation = await prisma.conversation.create({
        data: {
          name: "",
          participants: {
            createMany: {
              data: newParticipantIds.map((id) => ({
                userId: id,
                hasSeenLatestMessage: id === user.id,
                isAdmin: id === user.id,
              })),
            },
          },
        },
        include: { participants: true },
      });

      for (const participant of newConversation.participants) {
        if (participant.userId !== user.id) {
          await sendSSEEvent(
            participant.userId,
            JSON.stringify({
              type: SocketEvents.NewConversationCreated,
            })
          );
        }
      }

      return {
        statusCode: 201,
        body: {
          message: "A new conversation has been created.",
          conversationId: newConversation.id,
        },
      };
    }

    if (action.action === "update") {
      const currentSet = new Set(currentParticipantIds);
      const updatedSet = new Set(action.updatedIds);

      const usersToRemove = [...currentSet].filter((id) => !updatedSet.has(id));
      const usersToAdd = [...updatedSet].filter((id) => !currentSet.has(id));

      if (usersToRemove.length) {
        await prisma.conversationParticipant.deleteMany({
          where: {
            conversationId: currentConversation.id,
            userId: { in: usersToRemove },
          },
        });
      }

      if (usersToAdd.length) {
        await prisma.conversationParticipant.createMany({
          data: usersToAdd.map((id) => ({
            userId: id,
            conversationId: currentConversation.id,
            hasSeenLatestMessage: id === user.id,
            isAdmin: false,
          })),
        });
      }

      const updatedConversation = await prisma.conversation.findUniqueOrThrow({
        where: { id: currentConversation.id },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  uid: true,
                  fullName: true,
                  fullNameEL: true,
                },
              },
            },
          },
        },
      });

      const pastAndPresentParticipants = Array.from(
        new Set([
          ...currentParticipantIds,
          ...usersToAdd,
          ...usersToRemove,
        ]).values()
      );
      for (const participant of pastAndPresentParticipants) {
        await sendSSEEvent(
          participant,
          JSON.stringify({
            type: SocketEvents.ConversationParticipantsUpdate,
            body: {
              chatId: currentConversation.id,
              participants: currentConversation.participants,
            },
          })
        );
      }

      return {
        statusCode: 200,
        body: {
          message: "Successfully updated conversation participants",
          participantsList: updatedConversation.participants,
        },
      };
    }

    if (action.action === "pong") {
      return {
        statusCode: 200,
        body: { message: "No changes in participants." },
      };
    }

    return {
      statusCode: 400,
      body: { message: action.message },
    };
  } catch (error: any) {
    console.error("Error updating conversation:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

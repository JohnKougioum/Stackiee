import { PrismaClient } from '@prisma/client'
import z from 'zod'
import { removeDiacritics } from '~/server/utils/normalize'

const prisma = new PrismaClient()

const postCreationSchema = z.object({
  postBody: z.string(),
  semester: z.number().optional().nullable(),
  course: z.string().optional().nullable(),
  fileId: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);

  try {
    postCreationSchema.parse(requestBody);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Payload for post creation",
    });
  }

  const { postBody, semester, course, fileId } = requestBody;
  const normalizedBody = removeDiacritics(postBody)

  try {
    const newPost = await prisma.post.create({
      data: {
        body: postBody,
        normalizedBody,
        semester: semester || 0,
        course: course || '',
        User: {
          connect: {
            id: event.context.id.id,
          },
        },
      },
    });

    if (fileId) {
      await prisma.file.update({
        where: { id: fileId },
        data: { postId: newPost.id },
      });
    }

    return {
      statusCode: 200,
      body: "OK",
    }
  } catch (error) {
    throw createError({ statusCode: 500, message: "Failed to create post" });
  }
})
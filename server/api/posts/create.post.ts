import { PrismaClient } from '@prisma/client'
import z from 'zod'

const prisma = new PrismaClient()

const postCreationSchema = z.object({
  postBody: z.string(),
  semester: z.number().optional().nullable(),
  course: z.string().optional().nullable(),
  fileId: z.string().optional(),
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

  try {
    const newPost = await prisma.post.create({
      data: {
        body: postBody,
        semester: semester || 0,
        course: course || '',
        User: {
          connect: {
            uid: event.context.uid.uid,
          },
        },
      },
    });

    // 2) If a fileId was provided (meaning the client has already uploaded a file),
    //    link it to this newly created post
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

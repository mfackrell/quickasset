const { handleUpload } = require('@vercel/blob/client');

// CORRECT SYNTAX for your project:
module.exports = async function handler(request, response) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          tokenPayload: JSON.stringify({
            // optional payload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob uploaded', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}

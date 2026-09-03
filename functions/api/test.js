export async function onRequest(context) {
  return new Response(JSON.stringify({ message: 'api test ok', method: context.request.method }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt } = req.body

  console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY)

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      })
    })

    const data = await response.json()
    console.log('Groq response:', JSON.stringify(data))
    const text = data.choices?.[0]?.message?.content || 'No se pudo generar el análisis.'
    res.status(200).json({ content: [{ text }] })
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ content: [{ text: 'Error: ' + err.message }] })
  }
}
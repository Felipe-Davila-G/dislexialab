export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, format } = req.body

  const systemPrompt = format === 'ejercicios'
    ? `Eres un especialista en dislexia. Genera ejercicios personalizados en formato JSON válido. 
       Responde ÚNICAMENTE con un array JSON, sin texto adicional, sin markdown, sin backticks.
       Cada ejercicio tiene: tipo (string), prompt (string), kind ("opciones"|"texto"), 
       options (array de 4 strings, solo si kind es opciones), correct (número índice, solo si kind es opciones),
       answer (string, solo si kind es texto), explanation (string).`
    : `Eres un especialista en dislexia infantil. Responde en español, de forma empática y clara.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: format === 'ejercicios' ? 1500 : 300,
        temperature: 0.7
      })
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    if (format === 'ejercicios') {
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
        res.status(200).json({ ejercicios: parsed })
      } catch {
        res.status(200).json({ ejercicios: [] })
      }
    } else {
      res.status(200).json({ content: [{ text }] })
    }
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ content: [{ text: 'Error: ' + err.message }], ejercicios: [] })
  }
}
import { HttpContext } from '@adonisjs/core/http'
import { uploadValidator } from '#validators/upload'
import { GoogleGenerativeAI } from '@google/generative-ai'
import db from '@adonisjs/lucid/services/db'
import Bill from '#models/bill'

async function process_with_gemini(image: string, type: string): Promise<{ value: number }> {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY)

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const result = await model.generateContent([
    {
      inlineData: {
        data: image,
        mimeType: 'image/jpeg',
      },
    },
    { text: `This is a ${ type } bill, please extract the measure value in the following format: { value: number }, return it as json, do not add any extra comment.` },
  ])

  return JSON.parse(result.response.text())

}

export default class UploadsController {
  async upload({ request }: HttpContext) {

    const data = request.all()
    const validated = await uploadValidator.validate(data)

    const response = await process_with_gemini(validated.image, validated.measure_type)

    const bill = await Bill.query().exec()

    return {
      code: bill?.$extras.customer_code,
    }

  }
}

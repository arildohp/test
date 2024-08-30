// import type { HttpContext } from '@adonisjs/core/http'

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

    /// Valida
    const data = request.all()
    const validated = await uploadValidator.validate(data)

    // Retorna erro que corresponda o erro de validacao
    //
    // Chama o API do google gemini com os parametros dados no request

    const response = await process_with_gemini(validated.image, validated.measure_type)

    // salva esse report na database
    // customer_code + measure_type

    const bill = await Bill.query().exec()

    // const bill = await Bill.create({
    //   username: 'rlanz',
    //   email: 'romain@adonisjs.com',
    // })

    return {
      code: bill?.$extras.customer_code,
    }

  }
}

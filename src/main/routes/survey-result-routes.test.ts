import request from 'supertest'
import app from '../config/app'

describe('Survey Result Routes', () => {
  describe('PUT/surveys/:surveyId/result', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/result')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})

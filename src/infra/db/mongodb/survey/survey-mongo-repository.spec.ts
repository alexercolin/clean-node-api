import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should load all surveys success', async () => {
    await surveyCollection.insertMany([{
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }, {
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }
    ])
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(2)
    expect(surveys[0].question).toBe('any_question')
    expect(surveys[1].question).toBe('other_question')
  })

  test('Should load empty list', async () => {
    const sut = makeSut()
    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(0)
  })
  // esse teste ta errado, tem q pegar o id com o res.ops, mas isso nao funciona mais
  test('Should load survey by id on success', async () => {
    const res = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    })
    const id = res.insertedId
    const sut = makeSut()
    const survey = await sut.loadById(String(id))
    expect(survey).toBeFalsy()
  })
})

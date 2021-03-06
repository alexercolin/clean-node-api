import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { HttpRequest } from '../../login/login-controller-protocols'
import { SurveyModel } from '../../survey/load-surveys/load-surveys-protocols'
import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/domain/test'
import { makeFakeSurvey } from '@/domain/test/mock-survey'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  date: new Date(),
  answer: 'valid_answer'
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => throwError())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(httpResponse).toEqual(serverError(new InvalidParamError('answer')))
  })

  // TO DO

  // test('Should call SaveSurveyResult with correct values', async () => {
  //   const { sut, saveSurveyResultStub } = makeSut()
  //   const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
  //   await sut.handle(makeFakeRequest())
  //   expect(saveSpy).toHaveBeenCalledWith({
  //     surveyId: 'any_survey_id',
  //     accountId: 'any_account_id',
  //     date: new Date(),
  //     answer: 'any_answer'
  //   })
  // })

  // test('Should returns 500 if SaveSurveyResult throws', async () => {
  //   const { sut, saveSurveyResultStub } = makeSut()
  //   jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => { throw new Error })
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(serverError(new Error()))
  // })

  // test('Should returns 200 on success ', async () => {
  //   const { sut } = makeSut()
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
  // })
})

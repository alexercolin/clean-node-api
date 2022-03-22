import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../login/login-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = await this.loadSurveyById.loadById(httpRequest.params.surveyId)

      if (!surveyId) return forbidden(new InvalidParamError('surveyId'))

      return null
    } catch (error) {
      return serverError(error)
    }
  };
}

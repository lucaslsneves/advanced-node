import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}

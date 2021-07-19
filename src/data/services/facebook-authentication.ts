import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepo
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)

    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email })
    }

    return new AuthenticationError()
  }
}

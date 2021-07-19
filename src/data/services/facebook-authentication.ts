import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, CreateFacebookAccountRepo } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & CreateFacebookAccountRepo
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      await this.userAccountRepo.load({ email: fbData.email })
      await this.userAccountRepo.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}

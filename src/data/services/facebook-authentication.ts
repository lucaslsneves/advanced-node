import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, CreateFacebookAccountRepo, UpdateFacebookAccountRepo } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & CreateFacebookAccountRepo & UpdateFacebookAccountRepo
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      if (accountData?.name !== undefined) {
        await this.userAccountRepo.updateFromFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: fbData.facebookId
        })
      } else {
        await this.userAccountRepo.createFromFacebook(fbData)
      }
    }

    return new AuthenticationError()
  }
}

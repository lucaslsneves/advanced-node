import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'
import { TokenGenerator } from '@/data/contracts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepo & SaveFacebookAccountRepo,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const { id } = await this.userAccountRepo.saveFromFacebook(new FacebookAccount(fbData, accountData))
      await this.crypto.generateToken({ key: id })
    }

    return new AuthenticationError()
  }
}

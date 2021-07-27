import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'
import { FacebookAuthenticationService } from '@/data/services'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, SaveFacebookAccountRepo } from '@/data/contracts/repos'

import { TokenGenerator } from '@/data/contracts/crypto'

describe('FacebookAuthentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepo & SaveFacebookAccountRepo>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveFromFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo, crypto)
  })

  it('should call LoadFacebookUserApi with correct params only once', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserByEmailRepo with correct params only once when LoadFacebookApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepo with instance of FacebookAccount', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.saveFromFacebook).toHaveBeenCalledWith(expect.any(FacebookAccount))
    expect(userAccountRepo.saveFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' })
    expect(userAccountRepo.saveFromFacebook).toHaveBeenCalledTimes(1)
  })
})

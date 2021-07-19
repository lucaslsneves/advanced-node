import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationError } from '@/domain/errors'

import { FacebookAuthenticationService } from '@/data/services'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepo, CreateFacebookAccountRepo } from '@/data/contracts/repos'

describe('FacebookAuthentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepo>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepo>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo)
  })

  it('should call LoadFacebookUserApi with correct params only once', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserByEmailRepo with correct params only once when LoadFacebookApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepo with correct params only once when LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})

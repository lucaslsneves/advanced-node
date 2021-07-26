export interface LoadUserAccountRepo {
  load: (params: LoadUserAccountRepo.Params) => Promise<LoadUserAccountRepo.Result>
}

export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }
  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccountRepo {
  saveFromFacebook: (params: SaveFacebookAccountRepo.Params) => Promise<SaveFacebookAccountRepo.Result>
}

export namespace SaveFacebookAccountRepo {
  export type Params = {
    id?: string
    email: string
    name: string
    facebookId: string
  }
  export type Result = undefined
}

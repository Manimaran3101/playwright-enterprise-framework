import type { TokenResponse, UserData, UserResponse } from '@data/types';
import { step } from '@utils/step';
import { BaseApiClient } from './BaseApiClient';

export class AuthClient extends BaseApiClient {
  @step('API: register user')
  async register(user: UserData): Promise<UserResponse> {
    return this.send<UserResponse>('post', '/users/register', { data: user, expectedStatus: 201 });
  }

  @step('API: log in')
  async login(email: string, password: string): Promise<TokenResponse> {
    return this.send<TokenResponse>('post', '/users/login', { data: { email, password } });
  }

  @step('API: get current user')
  async me(): Promise<UserResponse> {
    return this.send<UserResponse>('get', '/users/me');
  }
}

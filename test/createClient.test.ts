import { createClient } from '../src'

describe('createClient', (): void => {
  test('Throws if no spaceUid is defined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => createClient({ token: 'token' })).toThrow(
      /spaceUid parameter is required/
    )
  })
  test('Throws if no token is defined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => createClient({ spaceUid: 'spaceUid' })).toThrow(
      /token parameter is required/
    )
  })
  test('Throws if apiType is neither cdn nor api', () => {
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      createClient({ spaceUid: 'spaceUid', token: 'token', apiType: 'xxx' })
    ).toThrow(/apiType parameter should be set to "cdn" or "api"/)
  })
  test('Throws if retryLimit is greater than 10', () => {
    expect(() =>
      createClient({
        spaceUid: 'spaceUid',
        token: 'token',
        apiType: 'cdn',
        retryLimit: 11,
      })
    ).toThrow(/retryLimit should be a value less than or equal to 10/)
  })
})

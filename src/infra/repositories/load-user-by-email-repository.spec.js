class LoadUserByEmailRepository {
    load (email){
        return null
    }
}

describe('LoadUserByEmail', () => {
    test('Should retun null if no user is found', async () => {
        const sut = new LoadUserByEmailRepository()
        const user = await sut.load('invalid_email@mail.com')
        expect(user).toBeNull();
    });
});
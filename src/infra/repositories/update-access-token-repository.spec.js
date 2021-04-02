const MongoHelper = require('../helpers/mongo-helper');
let db

class UpdateAcessTokenRepository {
  constructor (userModel){
    this.userModel = userModel
  }
  async update (userId,acessToken){
    await this.userModel.updateOne({
      _id: userId
    },{
      $set:{
        acessToken
      }
    })
  }
}

describe('UpdateAcessToken Repository', () => {
  beforeAll(async () => {
    client = await MongoHelper.connect (process.env.MONGO_URL);
    db = await MongoHelper.getDb();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('should update the user with the diven acessToken',async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAcessTokenRepository(userModel);

    const fakeUser = await userModel.insertOne({
      email:'valid_email@mail.com',
      name:'any_name',
      age: 50,
      state: 'any_name',
      password: 'hashed_password'
    });

    await sut.update(fakeUser.ops[0]._id,'valid_token');
    const updatedFakeUser = await userModel.findOne({_id:fakeUser.ops[0]._id })

    expect(updatedFakeUser.acessToken).toBe('valid_token');
  });
});
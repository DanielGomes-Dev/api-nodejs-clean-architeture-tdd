const request = require('supertest')
const app = require('../config/app')

describe('content-type middleware', () => {

    test('should return json content type as default', async() => {
        app.get('/content-type', (req, res) => {
            res.send({})
        })

        const res = await request(app).get('/content-type')
            .expect('content-type', /json/)

    });
});
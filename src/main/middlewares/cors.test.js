const request = require('supertest')
const app = require('../config/app')

describe('Name of the group', () => {

    test('should enable cors', async() => {
        app.get('/test_cors', (req, res) => {
            res.send('')
        })

        const res = await request(app).get('/test_cors')
        expect(res.headers['access-control-allow-origin']).toBe('*')
        expect(res.headers['access-control-allow-methods']).toBe('*')
        expect(res.headers['access-control-allow-headers']).toBe('*')

    });
});
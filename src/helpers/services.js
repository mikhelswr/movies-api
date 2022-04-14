const axios = require('axios')

const Service = {
    fetchService: async (url, res) => {
        try {
            const response = await axios.get(url)
            return new Promise((resolve, reject) => {
                if (response.status === 200) {
                    resolve(response)
                } else {
                    reject(response)
                }
            })
        } catch (error) {
            res.json({
                status: false,
                code: 404,
                message: "Tidak ada response!"
            })
        }
    }
}

module.exports = Service
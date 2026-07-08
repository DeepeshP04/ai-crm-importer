require("dotenv").config();

const extractCRMData = require("./src/services/aiService");

(async () => {

    const records = [
        {
            "Full Name": "John Doe",
            "Phone": "9876543210",
            "Email Address": "john@gmail.com",
            "Company Name": "Google",
            "Remarks": "Interested in buying apartment"
        }
    ];

    const result = await extractCRMData(records);

    console.log(JSON.stringify(result, null, 2));

})();
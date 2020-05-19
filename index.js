const express = require('express');
const bodyParser = require('body-parser');
const forge = require('node-forge');
const PORT = process.env.PORT || 3000;
const app = express();

// parse json
app.use(bodyParser.json());

// post data 
app.post('/api/get-desc', (req, res) => {
    let data = req.body.data;
    let key = req.body.key;
    let eksekusi = desc(data, key);

    res.send(eksekusi);
});

function desc(data, key){
    var text = forge.util.hexToBytes(data.substr(32));
    var iv = forge.util.hexToBytes(data.substr(0,32));
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    var decrypt = forge.util.createBuffer(forge.util.decode64(text));
    decipher.update(decrypt);
    decipher.finish();
    var result = forge.util.decode64(decipher.output.data);

    return result;
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
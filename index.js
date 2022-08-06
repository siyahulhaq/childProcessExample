const express = require('express');
const {fork, exec,spawn} = require('child_process');
const app = express();

app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    console.log(cmd)
    if (cmd) {
        exec(cmd, (err, stdout, stderr) => {
            if (err || stderr) {
                res.send(err || stderr);
            } else {
                res.send(stdout);
            }
        })
    } else {
        res.send('no cmd');
    }
});

app.get('/spawn', (req, res) => {
    const [cmd, ...args] = req.query.cmd?.split?.(' ');
    const child = spawn(cmd, args);
    child.stdout.on('data', (data) => {
        res.send(data);
    })
    child.stderr.on('data', (data) => {
        res.send(data);
    })
    
})

app.get('fork/one', (req, res) => {
    const sum = longTask();
    res.send({sum});
})

app.get('fork/two', async (req, res) => {
    const sum = await longTaskPromise()
    res.send({sum});
})

app.get('fork/three', (req, res) => {
    const child = fork('./longProcess.js');
    child.send('start');
    child.on('message', (sum) => {
        res.send({sum});
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

function longTask() {
    let sum = 0;
    for (let index = 0; index < 1e9; index++) {
        sum += index;
    }
    return sum;
}

function longTaskPromise () {
    return new Promise((resolve, reject) => {
        resolve(longTask());
    });
}
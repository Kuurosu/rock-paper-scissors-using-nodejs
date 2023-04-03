const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    switch (url.pathname) {
        case "/":
            if (req.method === "GET") {
                const name = url.searchParams.get("name");
                console.log(name);

                res.writeHead(200, { "Content-Type": "text/html" });
                fs.createReadStream("./index.html").pipe(res);
                break;
            } else if (req.method === "POST") {
                handlePostResponse(req, res);
                break;
            }
        default:
            res.writeHead(404, { "Content-Type": "text/html" });
            fs.createReadStream("./404.html").pipe(res);
            break;
    }
});

server.listen(5500, () => {
    console.log(server.address().port);
});

function handlePostResponse(req, res) {
    req.setEncoding("utf8");

    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        const choices = ["rock", "paper", "scissors"];
        const randomChoice = choices[Math.floor(Math.random() * 3)];

        const choice = body;

        let message;

        const tied = `You chose ${choice} and the computer chose ${randomChoice}. It's a tie!`;
        const victory = `You chose ${choice} and the computer chose ${randomChoice}. You win!`;
        const defeat = `You chose ${choice} and the computer chose ${randomChoice}. You lose!`;

        if (choice === randomChoice) {
            message = tied;
        } else if (
            (choice === "rock" && randomChoice === "scissors") ||
            (choice === "paper" && randomChoice === "rock") ||
            (choice === "scissors" && randomChoice === "paper")
        ) {
            message = victory;
        } else {
            message = defeat;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`You chose ${choice} and the computer chose ${randomChoice}.`)
    });
}
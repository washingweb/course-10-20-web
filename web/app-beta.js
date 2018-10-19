$(document).ready(() => {
  if (typeof web3 !== "undefined") {
    console.log("using injected");
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers

    console.log("using localhost");
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  var contract = new web3.eth.Contract(ABI, ADDRESS);

  contract.methods
    .getBalance()
    .call()
    .then(result => {
      console.log(result);
    });

  web3.eth.getAccounts().then(console.log);
  console.log(web3.eth.accounts);
});

const ADDRESS = "0x06a5be7f3594e9564a202244d42feccceef98ff8";

const ABI = [
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "howMuchWithdrawed",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_addr",
        type: "address"
      }
    ],
    name: "register",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    constant: false,
    inputs: [
      {
        name: "amount",
        type: "uint256"
      }
    ],
    name: "widthdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getBalance2",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "records",
    outputs: [
      {
        name: "amount",
        type: "uint256"
      },
      {
        name: "time",
        type: "uint256"
      },
      {
        name: "addr",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

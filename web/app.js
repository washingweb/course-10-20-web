const detectWeb3 = () => {
  if (web3 !== undefined) {
    console.log("using injected web3");
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log("using ganache:8545");
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
};

const getContract = () => {
  const contract = web3.eth.contract(ABI).at(ADDRESS);

  web3.eth.defaultAccount = web3.eth.accounts[0];
  currentAddress = web3.eth.accounts[0];

  web3.currentProvider.publicConfigStore.on("update", config => {
    web3.eth.defaultAccount = config.selectedAddress;
    currentAddress = config.selectedAddress;
    updateUiAccount(contract);
  });

  return contract;
};

const updateUiAccount = contract => {
  web3.eth.getBalance(ADDRESS, (err, result) => {
    if (err) alert(err);
    else {
      balance = result.toNumber();
      $("#balance").text(web3.fromWei(balance));
    }
  });

  contract.howMuchWithdrawed((err, result) => {
    howMuchWithdrawed = result.toNumber();
    const amount = web3.fromWei(howMuchWithdrawed);
    $("#withdraw-amount").html(amount);
  });

  contract.validUsers(currentAddress, (err, result) => {
    if (err) {
      alert(err);
    } else {
      console.log(currentAddress);
      console.log(result);
      isValidUser = result;
      if (isValidUser) {
        $("#btn-withdraw").removeClass("hidden");
      } else {
        $("#btn-withdraw").addClass("hidden");
      }
    }
  });

  contract.owner((err, result) => {
    isOwner = result == currentAddress;
    if (isOwner) {
      $("#address-management").removeClass("hidden");
    } else {
      $("#address-management").addClass("hidden");
    }
  });
};

const updataUiRecords = () => {
  const template = $("#records-template").html();
  const html = Mustache.render(template, records);
  $("#records").html(html);
};

const toRecord = log => {
  const dataString = new Date(log.time.toNumber() * 1000).toLocaleDateString();
  return {
    amount: web3.fromWei(log.amount.toNumber()),
    action: log.action,
    time: dataString
  };
};

let currentAddress = "";
let records = [];
let balance = 0;
let amountWithdrawed = 0;
let isValidUser = false;
let isOwner = false;

$(document).ready(() => {
  detectWeb3();

  const contract = getContract();

  // deposit
  $("#btn-deposit").click(() => {
    const amount = parseFloat($("#input-amount").val());
    console.log(`deposit ${amount} ether`);
    const opts = {
      value: web3.toWei(amount)
    };
    contract.deposit(opts, (err, result) => {
      if (err) {
        alert(err);
      } else {
        console.log("tx sent");
      }
    });
  });

  // withdraw
  $("#btn-withdraw").click(() => {
    const amount = parseFloat($("#input-amount").val());
    console.log(`withdraw ${amount} ether`);
    const wei = web3.toWei(amount);
    contract.withdraw(wei, (err, result) => {
      if (err) {
        alert(err);
        console.log(err);
      } else {
        console.log("tx sent");
        console.log(result);
      }
    });
  });

  // add user
  $("#btn-add-user").click(() => {
    const addr = $("#managed-address").val();
    contract.addUser(addr, (err, result) => {
      if (err) {
        alert(err);
      } else {
        console.log("tx sent");
      }
    });
  });

  // remove user
  $("#btn-remove-user").click(() => {
    const addr = $("#managed-address").val();
    contract.removeUser(addr, (err, result) => {
      if (err) {
        alert(err);
      } else {
        console.log("tx sent");
      }
    });
  });

  // events
  // watch latest
  contract.BalanceChanged().watch((err, result) => {
    if (err) {
      alert(err);
    } else {
      updateUiAccount(contract);
    }
  });

  // watch history
  contract
    .BalanceChanged({}, { fromBlock: 0, toBlock: "latest" })
    .watch((err, log) => {
      if (err) {
        alert(err);
      } else {
        records.push(toRecord(log.args));
        updataUiRecords();
      }
    });

  contract.UserChanged().watch((err, log) => {
    if (err) {
      alert(err);
    } else {
      updateUiAccount(contract);
    }
  });

  // same as evt.watch
  // contract.BalanceChanged((err, result) => {
  //   if (err) {
  //     alert(err);
  //   } else {
  //     updateUI();
  //   }
  // });

  // contract
  //   .BalanceChanged({}, { fromBlock: 0, toBlock: "latest" })
  //   .get((err, logs) => {
  //     if (err) {
  //       alert(err);
  //     } else {
  //       records = logs.map(log => toRecord(log.args));
  //       console.log(records);
  //       updataUiRecords();
  //     }
  //   });

  // no args...
  // const filter = web3.eth.filter({
  //   fromBlock: 0,
  //   toBlock: "latest",
  //   address: ADDRESS,
  //   topics: [web3.sha3("BalanceChanged(uint256,string)")]
  // });

  // filter.watch((err, result) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(result);
  //   }
  // });

  // web3.eth.getBlock("latest", (err, result) => {
  //   console.log(result);
  // });

  // updateUI();
  updateUiAccount(contract);
});

const ADDRESS = "0xe6042703475d0dd1bc2eb564a55f1832c2527171";
const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "addr",
        type: "address"
      },
      {
        indexed: false,
        name: "action",
        type: "string"
      }
    ],
    name: "UserChanged",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_addr",
        type: "address"
      }
    ],
    name: "addUser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
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
    inputs: [
      {
        name: "_addr",
        type: "address"
      }
    ],
    name: "removeUser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        name: "action",
        type: "string"
      },
      {
        indexed: false,
        name: "time",
        type: "uint256"
      }
    ],
    name: "BalanceChanged",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdraw",
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
    constant: true,
    inputs: [],
    name: "howMuchWithdrawed",
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
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      }
    ],
    name: "validUsers",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

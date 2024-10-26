// Make sure to check for window.ethereum being defined first
if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const abi = [
        "event AccountCreated(address[] owners, uint256 indexed id, uint256 timestamp)",
        "event Deposit(address indexed user, uint256 indexed accountId, uint256 value, uint256 timestamp)",
        "event Withdraw(uint256 indexed withdrawId, uint256 timestamp)",
        "event WithdrawRequested(address indexed user, uint256 indexed accountId, uint256 indexed withdrawId, uint256 amount, uint256 timestamp)",
        "function approveWithdraw(uint256 accountId, uint256 withdrawId)",
        "function createAccount(address[] otherOwners)",
        "function deposit(uint256 accountId) payable",
        "function getAccounts() view returns (uint256[])",
        "function getApprovals(uint256 accountId, uint256 withdrawId) view returns (uint256)",
        "function getBalance(uint256 accountId) view returns (uint256)",
        "function getOwners(uint256 accountId) view returns (address[])",
        "function requestWithDraw(uint256 accountId, uint256 amount)",
        "function withdraw(uint256 accountId, uint256 withdrawId)",
    ];

    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    let contract = null;

    async function createAccount() {
        await getAccess();
        const owners = document
            .getElementById("owners")
            .value.split(",")
            .filter((n) => n.trim());

        await contract.createAccount(owners).then(() => alert("Success"));
    }

    async function viewAccounts() {
        await getAccess();
        const result = await contract.getAccounts();
        console.log("=====")
        console.log(result)
        console.log("=====")
        document.getElementById("accounts").innerHTML = result.join(", ");
    }

    async function getAccess() {
        if (contract) return;
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        contract = new ethers.Contract(address, abi, signer);

        const eventLog = document.getElementById("events");
        contract.on("AccountCreated", (owners, id, event) => {
            eventLog.innerHTML += `Account Created: ID = ${id}, Owners = ${owners.join(", ")}<br>`;
        });
    }

    // Attach functions to the window object
    window.createAccount = createAccount;
    window.viewAccounts = viewAccounts;

} else {
    console.error("Please install MetaMask!");
}

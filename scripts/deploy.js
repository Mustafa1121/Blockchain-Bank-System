const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const BankAccount = await hre.ethers.getContractFactory("BankAccount");
  const bankAccount = await BankAccount.deploy();

  await bankAccount.waitForDeployment();
  await writeDeploymentInfo(bankAccount);
}

async function writeDeploymentInfo(contract) {
  const data = {
    contract: {
      address: contract.runner.address,
      signerAddress: contract.target,
      abi: contract.interface.format(),
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile("deployment.json", content, { encoding: "utf-8" });
}

main()
  .then(() => {
    console.log("pass");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

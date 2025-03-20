async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const ChatApp = await ethers.getContractFactory("ChatApp");
    const contract = await ChatApp.deploy();
  
    // await contract.waitForDeployment();
    console.log("Contract deployed at:", contract.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
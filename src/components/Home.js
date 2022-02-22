import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState , useRef } from "react";
import  IERC20  from "../ABI/StandardERC20.json"
import Web3Modal from 'web3modal'

function Home() {

  const {
    connector,
    library,
    account,
    chainId,
    activate,
    deactivate,
    active,
    error
  } = useWeb3React();
  const inputEl = useRef(null);
  const [balance, setBalance] = useState();
  const [tokensOBJ,setTokenOBJ] = useState([])
  const [tempToken,setTempToken] = useState(null)
  const [Tokenlist ,setTokenlist] = useState(null)
  const [Loading , setLoading] = useState(true)
  const Tokens = [
    "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
  ] //DAI;
  
const loadBalances = async (initail , arrT) =>{
  try {
    setLoading(true)
    let arr = arrT
    for(let i= initail ; i <Tokens.length; i++){
      let ERC20 = new ethers.Contract(Tokens[i], IERC20, library)
      let name = await ERC20.name();
      let decimals = await ERC20.decimals()
      let balance = await ERC20.balanceOf(account);
      balance = ethers.utils.formatUnits(balance,decimals)
      let obj = {
        name:name,
        balance:balance
      }
      arr.push(obj)
    }
    console.log("running")
    setTokenOBJ(arr);
    setTokenlist(arr.map((detail) =>
    <div>{detail.name}  {detail.balance}</div>
  ))
    console.log(arr)
    setLoading(false)
  } catch (error) {
    console.log(error)
  }
 
}



const importToken = async () =>{
  try {
    Tokens.push(tempToken)
    console.log(tokensOBJ)
    await loadBalances(Tokens.length-1, tokensOBJ)
    inputEl.current.value = null
  } catch (error) {
    
  }
}

  useEffect(()=>{
    (async ()=>{
      if(library && account){
        try {
          const _balance = await library.getBalance(account);
          setBalance(ethers.utils.formatEther(_balance));
          await loadBalances(0,[])              
        }
        catch(error){
          console.log("Error ",error.message);
          setBalance("0");
        }
        return () => {
          setBalance(undefined);
        };
      }
    })();
  }, [library, account, chainId]);

  return (
    <div>
      <div>Chain Id: {chainId}</div><br/>
      <div>Account: {account}</div><br/>
      <div><h1>Tokens</h1></div>
      <div><h4>Import token</h4>
      <input ref={inputEl} placeholder="Enter token address" onChange={(e)=>setTempToken(e.target.value)}/>
      <button onClick={importToken}>import</button>
      </div><br/>
      {Loading ? <div>loading ...</div>:
      <div>ETH Balance: {balance}<br/>{Tokenlist}</div>}
      
    </div>
  );
}

export default Home;

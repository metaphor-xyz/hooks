"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWalletManager = void 0;
const ethers_1 = require("ethers");
const react_1 = __importStar(require("react"));
const WalletManagerContext = (0, react_1.createContext)(null);
function WalletManagerProvider({ children }) {
    const [ethersProvider, setEthersProvider] = (0, react_1.useState)(null);
    const [mainAccount, setMainAccount] = (0, react_1.useState)(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connectProvider = (0, react_1.useCallback)((provider) => {
        const etherProvider = new ethers_1.ethers.providers.Web3Provider(provider);
        setEthersProvider(etherProvider);
        etherProvider.listAccounts().then(accounts => setMainAccount(accounts[0]));
    }, []);
    return (react_1.default.createElement(WalletManagerContext.Provider, { value: {
            connectProvider,
            connected: !!ethersProvider,
            provider: ethersProvider,
            mainAccount,
        } }, children));
}
exports.default = WalletManagerProvider;
function useWalletManager() {
    const context = (0, react_1.useContext)(WalletManagerContext);
    if (!context) {
        throw new Error('useWalletManager must be used inside WalletManagerProvider');
    }
    return context;
}
exports.useWalletManager = useWalletManager;
//# sourceMappingURL=WalletManagerProvider.js.map
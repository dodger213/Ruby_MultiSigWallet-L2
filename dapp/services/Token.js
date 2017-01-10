(
  function () {
    angular
    .module("multiSigWeb")
    .service("Token", function (Wallet) {
      var factory = {};

      factory.abi = abiJSON.token.abi;

      factory.balanceOf = function (address, owner, cb) {
        var instance = Wallet.web3.eth.contract(factory.abi).at(address);
        return Wallet.callRequest(
          instance.balanceOf,
          [owner],
          cb
        );
      };

      factory.name = function (address, cb) {
        var instance = Wallet.web3.eth.contract(factory.abi).at(address);
        return Wallet.callRequest(
          instance.name,
          [],
          cb
        );
      };

      factory.symbol = function (address, cb) {
        var instance = Wallet.web3.eth.contract(factory.abi).at(address);
        return Wallet.callRequest(
          instance.symbol,
          [],
          cb
        );
      };

      factory.decimals = function (address, cb) {
        var instance = Wallet.web3.eth.contract(factory.abi).at(address);
        return Wallet.callRequest(
          instance.decimals,
          [],
          cb
        );
      };

      factory.transfer = function (tokenAddress, to, value, cb) {
        var instance = Wallet.web3.eth.contract(factory.abi).at(tokenAddress);
        instance.transfer(to, value, cb);
      };

      factory.transferOffline = function (tokenAddress, to, value, cb) {
        var instance = Wallet.web3.eth.contract(factory.abi).at(tokenAddress);
        var data = instance.transfer.getData(to, value);

        Wallet.getUserNonce(function (e, nonce) {
          if (e) {
            cb(e);
          }
          else {
            Wallet.offlineTransaction(to, data, nonce, cb);
          }
        });
      };

      factory.withdraw = function (tokenAddress, wallet, to, value, cb) {
        var instance = wallet.web3.eth.contract(wallet.json.multiSigDailyLimit.abi).at(address);
        var data = instance.changeDailyLimit.getData(
          limit,
          cb
        );
        // Get nonce
        wallet.getNonce(wallet, tokenAddress, "0x0", data, function (e, nonce) {
          if (e) {
            cb(e);
          }
          else {
            instance.submitTransaction(tokenAddress, "0x0", data, nonce, wallet.txDefaults(), cb);
          }
        }).call();
      };

      factory.withdrawOffline = function (tokenAddress, wallet, to, value, cb) {
        var walletInstance = wallet.web3.eth.contract(wallet.json.multiSigDailyLimit.abi).at(wallet);
        var tokenInstance = wallet.web3.eth.contract(wallet.json.token.abi).at(tokenAddress);
        var data = tokenInstance.transfer.getData(
          to,
          value
        );

        // Get nonce
        wallet.getWalletNonces(function (e, nonces) {
          if (e) {
            cb(e);
          }
          else {
            var mainData = walletInstance.submitTransaction.getData(tokenAddress, "0x0", data, nonces.multisig, cb);
            wallet.offlineTransaction(wallet, mainData, nonces.account, cb);
          }
        });
      }

      return factory;
    });
  }
)();
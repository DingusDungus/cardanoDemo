# cardanoDemo

## Installation of cardano-node dependencies
As we are first going to be installing cardano node, we are going to have to run this command to fetch dependencies.
```
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install automake build-essential pkg-config libffi-dev libgmp-dev libssl-dev libtinfo-dev libsystemd-dev zlib1g-dev make g++ tmux git jq wget libncursesw5 libtool autoconf -y
```
After dependencies have been fetched we now have to install GHC (glasgow haskell compiler) through this command <br>
```
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
```
Press yes or enter on all questions asked <br>
When the GHC components have been fetched run<br>
```
ghcup install ghc 8.10.7
ghcup set ghc 8.10.7
```
Later install preferred version of cabal made på IOHK<br>
```
ghcup install cabal 3.6.2.0
ghcup set cabal 3.6.2.0
```
## Installation of cardano-node
Making a working dir for cardano-node src <br>
```
mkdir -p $HOME/cardano-src
cd $HOME/cardano-src
```
Afterwards we must download and compile libsodium
```
git clone https://github.com/input-output-hk/libsodium
cd libsodium
git checkout 66f017f1
./autogen.sh
./configure
make
sudo make install
```
Afterwards you will have to open up your .bashrc in `$HOME` and write into the lower region of the file (exampels of accessing file is `nano .bashrc`)<br>:
```
export LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"
```
### Finally ready to start on cardano-node<br>
Starting with:<br>
```
cd $HOME/cardano-src
```
Followed by:<br>
```
git clone https://github.com/input-output-hk/cardano-node.git
cd cardano-node
git fetch --all --recurse-submodules --tags
```
and
```
git checkout $(curl -s https://api.github.com/repos/input-output-hk/cardano-node/releases/latest | jq -r .tag_name)
```
After this has been done we need to configure build options:
```
cabal configure --with-compiler=ghc-8.10.7
```
#### Building the node
We have now downloaded and compiled everything we need to build the node, which can be done through:
```
cabal build cardano-node cardano-cli
```
Then copying the scripts to the .bin:
```
mkdir -p $HOME/.local/bin
cp -p "$(./scripts/bin-path.sh cardano-node)" $HOME/.local/bin/
cp -p "$(./scripts/bin-path.sh cardano-cli)" $HOME/.local/bin/
```
Then we add this to our .bashprofile in `$HOME`:
```
export PATH="$HOME/.local/bin/:$PATH"
```
Again through something like `nano ~/.bashprofile`
Finally we are now hopefully done ansd can be tested through writing `cardano-cli --version`

# Testing and running the web app
After going through the painful struggle of actually installing cardano-node, we can now run the app. <br>
Firstly however we must have an isntance of cardano-node running locally, this can be done through writing the commands:
```
mkdir $HOME/cardano
cd $HOME/cardano

curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-topology.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-shelley-genesis.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-config.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-byron-genesis.json
curl -O -J https://hydra.iohk.io/build/7654130/download/1/testnet-alonzo-genesis.json
```
This downloads the config-files needed for the testnet and is useful for our project-development. Later you can now run the current-node from anywhere on your computer through these commands
```
cardano-node run \
--config $HOME/cardano/testnet-config.json \
--database-path $HOME/cardano/db/ \
--socket-path $HOME/cardano/db/node.socket \
--host-addr 127.0.0.1 \
--port 1337 \
--topology $HOME/cardano/testnet-topology.json
```
If everything has been followed correctly in the rest of the guide, this should start it up with no issues.
<br>
After this we can do an easy `npm install` in the working directory of the web app followed by an `node index.js`. When this is done you can now find the web app on `localhost:1338` in your browser.
<br>

#!/bin/bash
export PATH="$HOME/.foundry/bin:$PATH"
cd $HOME/.openclaw/skills/aavegotchi/scripts
./pet.sh 9638 >> $HOME/.openclaw/logs/aavegotchi-autopet.log 2>&1

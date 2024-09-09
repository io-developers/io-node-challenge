#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { config } from 'dotenv';

import { IoNodeChallengeStack } from '../lib/io-node-challenge-stack';

config();

const app = new cdk.App();
// eslint-disable-next-line no-new
new IoNodeChallengeStack(app, 'IoNodeChallengeStack');

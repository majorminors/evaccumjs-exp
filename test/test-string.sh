#!/bin/bash

read -p 'enter password: ' password

echo "testing as coherence thresholding (cthresh)"
curl -u psignifit:$password -d @test_request.json -H "Content-Type: application/json" -X POST https://studies.mrc-cbu.cam.ac.uk/pyapps/util/cthresh

echo "testing as matching thresholding (rthresh)"
curl -u psignifit:$password -d @test_request.json -H "Content-Type: application/json" -X POST https://studies.mrc-cbu.cam.ac.uk/pyapps/util/cthresh

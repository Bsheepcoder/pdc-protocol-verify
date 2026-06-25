#!/usr/bin/env node

'use strict'

const https = require('https')
const http = require('http')

function fetch(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { timeout: 10000 }, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        resolve({ status: res.statusCode, body, ok: res.statusCode === 200 })
      })
    })
    req.on('error', (err) => {
      resolve({ status: 0, body: '', ok: false, error: err.message })
    })
    req.on('timeout', () => {
      req.destroy()
      resolve({ status: 0, body: '', ok: false, error: 'timeout' })
    })
  })
}

async function verifySite(baseURL) {
  const base = baseURL.replace(/\/$/, '')
  const results = { url: base, checks: [], passed: false }

  const llmsTxt = await fetch(base + '/llms.txt')
  results.checks.push({
    endpoint: '/llms.txt',
    status: llmsTxt.status,
    ok: llmsTxt.ok,
    error: llmsTxt.error || null
  })

  const apiIndex = await fetch(base + '/api/index.json')
  let postCount = null
  if (apiIndex.ok) {
    try {
      const data = JSON.parse(apiIndex.body)
      postCount = Array.isArray(data) ? data.length : (data.posts ? data.posts.length : null)
    } catch (e) {
      results.checks.push({
        endpoint: '/api/index.json',
        status: apiIndex.status,
        ok: false,
        error: 'invalid JSON: ' + e.message
      })
    }
  }
  const apiCheck = {
    endpoint: '/api/index.json',
    status: apiIndex.status,
    ok: apiIndex.ok,
    error: apiIndex.error || null
  }
  if (postCount !== null) apiCheck.postCount = postCount
  if (!results.checks.find(c => c.endpoint === '/api/index.json')) {
    results.checks.push(apiCheck)
  } else {
    Object.assign(results.checks.find(c => c.endpoint === '/api/index.json'), apiCheck)
  }

  results.passed = llmsTxt.ok && apiIndex.ok
  return results
}

function formatResult(name, result) {
  const icon = result.passed ? '✓' : '✗'
  console.log(`\n${icon} ${name} (${result.url})`)
  for (const check of result.checks) {
    const status = check.ok ? '200 OK' : `${check.status || 'ERR'} ${check.error || ''}`
    const extra = check.postCount !== undefined ? ` (${check.postCount} posts)` : ''
    console.log(`  ${check.endpoint} → ${status}${extra}`)
  }
}

async function main() {
  const arg = process.argv[2]

  if (arg) {
    const result = await verifySite(arg)
    formatResult('Site', result)
    process.exit(result.passed ? 0 : 1)
  }

  console.log('Fetching adopters list from https://bsheepcoder.github.io/api/adopters.json...')
  const res = await fetch('https://bsheepcoder.github.io/api/adopters.json')
  if (!res.ok) {
    console.error('Failed to fetch adopters.json:', res.status)
    process.exit(1)
  }

  let adopters
  try {
    adopters = JSON.parse(res.body)
  } catch (e) {
    console.error('Failed to parse adopters.json:', e.message)
    process.exit(1)
  }

  console.log(`Found ${adopters.length} adopter(s). Verifying...\n`)

  let passed = 0
  let failed = 0

  for (const adopter of adopters) {
    const result = await verifySite(adopter.url)
    formatResult(adopter.name, result)
    if (result.passed) { passed++ } else { failed++ }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Total: ${adopters.length} | Passed: ${passed} | Failed: ${failed}`)
  process.exit(failed > 0 ? 1 : 0)
}

main()

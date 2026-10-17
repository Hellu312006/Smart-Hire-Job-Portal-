# Security Policy

## Supported Versions

SmartHire actively maintains security patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

We take the security of SmartHire seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** disclose the issue publicly in an open GitHub issue or pull request.
2. Draft a report detailing:
   - Type of vulnerability (e.g., authentication bypass, injection, IDOR, SSRF).
   - Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
   - Affected components, endpoints, or classes.
   - Recommended remediation (if known).
3. Contact the maintainers privately via GitHub Security Advisories or maintainer contact email.
4. Maintainers will acknowledge receipt within 48 hours and work with you to validate and remediate the issue prior to public disclosure.

---

## Sensitive Data Practices

- **Never** commit real passwords, secret keys, or private certificates into version control.
- Use `.env.example` as a template and provide real secrets strictly via environment variables or secret managers (e.g., AWS Secrets Manager, GitHub Secrets, Docker Secrets).
- Default JWT secrets provided in example configurations are intended solely for offline local development and **must** be rotated in any staging or production deployment.

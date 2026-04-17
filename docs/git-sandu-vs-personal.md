# Use Sandu’s GitHub in this repo, yours everywhere else

This machine can keep **your** GitHub as the default and only use **Sandu’s** account for **this** project.

## 1. Default identity = you (global, once)

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Every repo uses this **unless** the repo overrides it locally.

## 2. This repo only = Sandu (local)

From this project folder:

```bash
cd /path/to/Sandu
git config user.name "Sandu Negrea"
git config user.email "COMMIT_EMAIL_ON_SANDU_GITHUB_ACCOUNT"
```

Check:

```bash
git config --show-origin --get user.email
```

You should see `file:.git/config` for this repo, not only `global`.

Optional helper:

```bash
./scripts/configure-sandu-repo-git.sh
```

## 3. Two GitHub logins: use SSH (recommended)

Use **two SSH keys**: one linked to **your** GitHub, one to **Sandu’s** GitHub.

1. Create a key for Sandu (only once):

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_sandu -C "sandu-github"
   ```

2. Add **`~/.ssh/id_ed25519_sandu.pub`** to **Sandu’s** GitHub → **Settings → SSH and GPG keys**.

3. Edit **`~/.ssh/config`**:

   ```text
   # Your personal GitHub (default)
   Host github.com
     HostName github.com
     User git
     IdentityFile ~/.ssh/id_ed25519
     IdentitiesOnly yes

   # Sandu’s GitHub — use host alias in remote URLs
   Host github.com-sandu
     HostName github.com
     User git
     IdentityFile ~/.ssh/id_ed25519_sandu
     IdentitiesOnly yes
   ```

   Adjust `IdentityFile` paths if your personal key has another name.

4. Point **this repo’s** `origin` at the alias (replace `OWNER` / `REPO`):

   ```bash
   cd /path/to/Sandu
   git remote set-url origin git@github.com-sandu:OWNER/REPO.git
   ```

Other workspaces keep using `git@github.com:user/repo.git` → personal key.

5. Test Sandu:

   ```bash
   ssh -T git@github.com-sandu
   ```

   You should see Sandu’s GitHub username.

## 4. GitHub CLI (`gh`)

`gh` is often **one active account** per machine unless you use [multiple accounts](https://cli.github.com/manual/gh_auth_login).

Practical approach:

- Use **`gh`** day to day with **your** account.
- For Sandu-only actions, either run `gh auth switch` when in this folder (if you added both accounts), or use the **GitHub website** for Sandu’s repo settings, or a **Sandu PAT** in env vars only when needed (CI/scripts).

## 5. Cursor

Cursor uses your system **git** and **SSH agent**. It does not need a separate “Sandu login” if remotes and SSH config are set as above. Other projects keep using your normal `github.com` remote and global git user.

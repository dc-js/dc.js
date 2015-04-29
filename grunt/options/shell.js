module.exports = {
	merge: {
        command: function (pr) {
            return [
                'git fetch origin',
                'git checkout master',
                'git reset --hard origin/master',
                'git fetch origin',
                'git merge --no-ff origin/pr/' + pr + ' -m \'Merge pull request #' + pr + '\''
            ].join('&&');
        },
        options: {
            stdout: true,
            failOnError: true
        }
    },
    amend: {
        command: 'git commit -a --amend --no-edit',
        options: {
            stdout: true,
            failOnError: true
        }
    },
    hooks: {
        command: 'cp -n scripts/pre-commit.sh .git/hooks/pre-commit' +
            ' || echo \'Cowardly refusing to overwrite your existing git pre-commit hook.\''
    }
};

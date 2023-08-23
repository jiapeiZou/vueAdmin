
// eslint 说明书
module.exports = {
    // 运行环境
    "env": {
        "browser": true, // 浏览器端
        "es2021": true
    },
    // 规则继承
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential"
    ],
    // 为特定类型文件指定处理器
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    // ESlint 支持使用第三方插件 。在使用插件之前 你需要使用npm 安装它
    // 该前缀 eslnt-plugin- 被省略
    "plugins": [
        "@typescript-eslint",
        "vue"
    ],
    // eslint 规则
    "rules": {
    }
}

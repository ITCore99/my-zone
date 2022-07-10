<template>
   <div>
        <div class="title">{{title}}</div>
        <div class="contnet">今天很高心学习了很多的东西</div>
        <button @click="handleClick">点击</button>
    </div>
</template>
<script>
export default {
    name:"App",
    data() {
        return {
            title: "hello world"
        }
    },
    methods: {
        handleClick() {
            alert("弹出来");
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    color:green;
    font-size: 50px;
    transform: translate(30px);
}
.contnet {
    color: purple;
    font-size: 50px;
}
</style>
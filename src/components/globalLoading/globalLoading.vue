<template>
  <div class="mask">
      <div class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
      </div>
  </div>
</template>

<script>
export default {
  name: "GlobalLoading"
};
</script>

<style lang="less" scoped>
    .mask{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.2);
        .loading{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          span{
            display: block;
            width: 40px;
            height: 40px;
            --duration: 1.5s;
          }
        }
    }

.loading span {
    animation: var(--duration) ease-in-out infinite alternate;
}

.loading span:nth-child(1) {
    animation-name: jump-off-1;
}

.loading span:nth-child(2) {
    animation-name: jump-off-2;
}

.loading span:nth-child(3) {
    animation-name: jump-off-3;
}

.loading span:nth-child(4) {
    animation-name: jump-off-4;
}

@keyframes jump-off-1 {
    0%, 15% {
        transform: rotate(0deg);
    }

    35%, 100% {
        transform-origin: -50% center;
        transform: rotate(-180deg) translate(100px,-120px);
    }
}

@keyframes jump-off-2 {
    0%, 30% {
        transform: rotate(0deg);
    }

    50%, 100% {
        transform-origin: -50% center;
        transform: rotate(-180deg) translate(100px,-40px);
    }
}

@keyframes jump-off-3 {
    0%, 45% {
        transform: rotate(0deg);
    }

    65%, 100% {
        transform-origin: -50% center;
        transform: rotate(-180deg) translate(100px,40px);
    }
}

@keyframes jump-off-4 {
    0%, 60% {
        transform: rotate(0deg);
    }

    80%, 100% {
        transform-origin: -50% center;
        transform: rotate(-180deg) translate(100px,120px);
    }
}

.loading span::before {    
    content: '';
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: 15%;
    box-shadow: 0 0 0.1em rgba(0, 0, 0, 0.3);
}


.loading span::before {
    background-color: dodgerblue;
    animation: var(--duration) ease-in-out infinite alternate;
}

.loading span:nth-child(1)::before {
    filter: brightness(1);
    animation-name: jump-down-1;
}

.loading span:nth-child(2)::before {
    filter: brightness(1.15);
    animation-name: jump-down-2;
}

.loading span:nth-child(3)::before {
    filter: brightness(1.3);
    animation-name: jump-down-3;
}

.loading span:nth-child(4)::before {
    filter: brightness(1.45);
    animation-name: jump-down-4;
}

@keyframes jump-down-1 {
    5% {
        transform: scale(1, 1);
    }

    15% {
        transform-origin: center bottom;
        transform: scale(1.3, 0.7);
    }

    20%, 25% {
        transform-origin: center bottom;
        transform: scale(0.8, 1.4);
    }

    40% {
        transform-origin: center top;
        transform: scale(1.3, 0.7);
    }

    55%, 100% {
        transform: scale(1, 1);
    }
}

@keyframes jump-down-2 {
    20% {
        transform: scale(1, 1);
    }

    30% {
        transform-origin: center bottom;
        transform: scale(1.3, 0.7);
    }

    35%, 40% {
        transform-origin: center bottom;
        transform: scale(0.8, 1.4);
    }

    55% {
        transform-origin: center top;
        transform: scale(1.3, 0.7);
    }

    70%, 100% {
        transform: scale(1, 1);
    }
}

@keyframes jump-down-3 {
    35% {
        transform: scale(1, 1);
    }

    45% {
        transform-origin: center bottom;
        transform: scale(1.3, 0.7);
    }

    50%, 55% {
        transform-origin: center bottom;
        transform: scale(0.8, 1.4);
    }

    70% {
        transform-origin: center top;
        transform: scale(1.3, 0.7);
    }

    85%, 100% {
        transform: scale(1, 1);
    }
}

@keyframes jump-down-4 {
    50% {
        transform: scale(1, 1);
    }

    60% {
        transform-origin: center bottom;
        transform: scale(1.3, 0.7);
    }

    65%, 70% {
        transform-origin: center bottom;
        transform: scale(0.8, 1.4);
    }

    85% {
        transform-origin: center top;
        transform: scale(1.3, 0.7);
    }

    100%, 100% {
        transform: scale(1, 1);
    }
}


</style>

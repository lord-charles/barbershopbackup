import React from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {COLORS, constants, images, SIZES, icons} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import {Shadow} from 'react-native-shadow-2';
const OnBoarding = ({navigation}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current; // for dot animation
  const FlatListRef = React.useRef(0);
  // now we need to keep track of which page we are in so that we can render (LETS GET STARTED) button
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const onViewChangeRef = React.useRef(({viewableItems, changed}) => {
    setCurrentIndex(viewableItems[0].index);
  });
  const Dots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View className="items-center flex-row  justify-center gap-x-3 relative top-[-30px] right-[160px] h-[27px]">
        {constants.onboarding_screens.map((item, index) => {
          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [COLORS.gray, COLORS.lightOrange, COLORS.gray],
            extrapolate: 'clamp',
          });
          //for dot animation

          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [4, 8, 4],
            extrapolate: 'clamp',
          });
          const dotHeight = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [12, 24, 12],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`dot-${index}`}
              className="rounded-full"
              style={{
                backgroundColor: dotColor,
                width: dotWidth,
                height: dotHeight,
              }}
            />
          );
        })}
      </View>
    );
  };
  function renderHeaderlogo() {
    return (
      <View className="items-center">
        <Image
          source={images.logo_02}
          resizeMode="contain"
          className="h-[100px] w-[200px] absolute top-2"
        />
      </View>
    );
  }
  function renderFooter() {
    return (
      <View style={{backgroundColor: COLORS.black5}}>
        {/* pagination dots */}
        <View>
          <Dots />
        </View>
        {/* skip & Next button  */}
        {currentIndex < constants.onboarding_screens.length - 1 ? (
          <View className="justify-end flex-row mx-5 mt-[-50px] items-center relative top-[-10px]">
            {/* <TouchableOpacity>
              <Text
                className="p-2 bg-orange-300 rounded-lg text-black font-bold"
                onPress={() => navigation.replace('SignIn')}>
                skip
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                let index = Math.ceil(Number(scrollX._value / 600));
                if (index < constants.onboarding_screens.length - 1) {
                  //scroll to the next page
                  FlatListRef?.current?.scrollToIndex({
                    index: index + 1,
                    Animated: true,
                  });
                } else {
                  // navigation.replace('SignIn');
                }
              }}>
              <View className="bg-orange-300 p-3 rounded-full h-[50px] w-[50px] items-center justify-center mt-[-10px]">
                <Image
                  source={icons.right_arrow}
                  className="w-[31px] h-[20px] "
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mx-5 mt-[-50px] items-center relative top-[-14px]">
            <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
              <Text className="text-black font-extrabold text-[25px] bg-orange-400 py-2 px-[91px] rounded-lg">
                Let's Get Started
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {/* renderHeaderlogo */}
      {renderHeaderlogo()}
      <Animated.FlatList
        ref={FlatListRef} //useful when clecking next to move to next slide
        horizontal
        pagingEnabled //displays each image on its own page
        data={constants.onboarding_screens}
        scrollEventThrottle={16}
        snapToAlignment="center" // snapss on a page
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )} // for dot animation
        onViewableItemsChanged={onViewChangeRef.current} //helps me which page am on
        renderItem={({item}) => {
          return (
            <View>
              <View className="flex-3 h-[85vh]">
                <ImageBackground
                  source={item.backgroundImage}
                  className="flex-1 h-[100%] w-[100%] items-center justify-end"></ImageBackground>
              </View>
              {/* DETAILS */}
              <View className="items-center  w-screen  relative top-[-67px] bg-transparent">
                <Text className="font-extrabold text-[23px] text-white text-center mx-[100px]">
                  {item.title}
                </Text>
              </View>

              <LinearGradient
                colors={['transparent', '#131313', '#000000']}
                className="absolute bottom-[0px] w-full h-[110px]">
                <Text
                  className=" text-[15px] text-white mt-2 text-center  w-full
              ">
                  {item.description}
                </Text>
              </LinearGradient>
            </View>
          );
        }}
      />
      {/* renderFooter */}
      {renderFooter()}
    </View>
  );
};

export default OnBoarding;

import cv2
import numpy as np
from flask import Flask
from flask_sock import Sock
import mediapipe as mp

app = Flask(__name__)
sock = Sock(app)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)

puntos_correctos_a = [
    [0.3899029493331909, 0.5983290076255798, -1.20123183933174e-06],
    [0.5690808296203613, 0.535675048828125, -0.041732121258974075],
    [0.7105618715286255, 0.42577654123306274, -0.0587068572640419],
    [0.8097320795059204, 0.32227039337158203, -0.08518218994140625],
    [0.8850561380386353, 0.24474023282527924, -0.1061994880437851],
    [0.6070766448974609, 0.2799985110759735, 0.0074511184357106686],
    [0.6363704800605774, 0.1799328476190567, -0.07862775772809982],
    [0.6124398708343506, 0.2813684344291687, -0.13215120136737823],
    [0.5889914035797119, 0.3712860643863678, -0.14996717870235443],
    [0.4950551688671112, 0.27106937766075134, -0.003384589683264494],
    [0.5206844210624695, 0.174390971660614, -0.1001226082444191],
    [0.5080667734146118, 0.3120410442352295, -0.13056999444961548],
    [0.4963538944721222, 0.4140177369117737, -0.12443476170301437],
    [0.38234496116638184, 0.2798488736152649, -0.028698114678263664],
    [0.4019307494163513, 0.198895663022995, -0.1230044960975647],
    [0.4116726517677307, 0.33952853083610535, -0.11029388010501862],
    [0.41423308849334717, 0.4368825852870941, -0.07110188156366348],
    [0.26619184017181396, 0.30212387442588806, -0.058157965540885925],
    [0.289226770401001, 0.22362665832042694, -0.11443466693162918],
    [0.31954407691955566, 0.3138759732246399, -0.09318237751722336],
    [0.3327474594116211, 0.3863895535469055, -0.05817060545086861]
]

puntos_correctos_b = [
    (0.4737216532230377, 0.7189333438873291, 6.90875992859219e-07),
    (0.5954307913780212, 0.6289174556732178, -0.04804322496056557),
    (0.6297359466552734, 0.5104575753211975, -0.05840373411774635),
    (0.5362231731414795, 0.4237061142921448, -0.06685004383325577),
    (0.44197750091552734, 0.38224682211875916, -0.0754396915435791),
    (0.6154313683509827, 0.4062630832195282, 0.0011392063461244106),
    (0.6184628009796143, 0.28105002641677856, -0.028587399050593376),
    (0.6097744703292847, 0.20188458263874054, -0.06104413792490959),
    (0.6003618836402893, 0.1312555968761444, -0.08660709857940674),
    (0.5318940281867981, 0.39280617237091064, -0.003886784426867962),
    ( 0.5365020036697388, 0.2518523633480072, -0.03130878508090973),
    ( 0.5363906621932983, 0.15794020891189575, -0.06676267832517624),
    ( 0.5381316542625427, 0.07893595099449158, -0.0927945002913475),
    ( 0.45674648880958557, 0.4055764675140381, -0.01892658695578575),
    ( 0.45775991678237915, 0.27145060896873474, -0.05281488969922066),
    ( 0.4645824730396271, 0.18200251460075378, -0.08650927990674973),
    ( 0.4687820076942444, 0.110536128282547, 0.10771483182907104),
    ( 0.3773486018180847, 0.43878111243247986, -0.03903563320636749),
    ( 0.37309157848358154, 0.3338767886161804, -0.06967679411172867),
    ( 0.3797380328178406, 0.2622144818305969, -0.08655083924531937),
    ( 0.3878788948059082, 0.1989011913537979, -0.097742959856987)
]

pubtos_correctos_c = [
    [0.49561452865600586, 0.7966222167015076, 7.229415928122762e-07],
    [0.6492520570755005, 0.7230750918388367, 0.0008869275916367769],
    [0.7564579248428345, 0.6064603328704834, -0.015470944344997406],
    [0.8406206965446472, 0.5237719416618347, -0.049329835921525955],
    [0.8089673519134521, 0.4436749219894409, -0.08205438405275345],
    [0.5687514543533325, 0.38065940141677856, 0.03046245686709881],
    [0.5969046950340271, 0.2090139091014862, -0.031198278069496155],
    [0.7009880542755127, 0.1830138862133026, -0.08582054078578949],
    [0.7884359359741211, 0.21234624087810516, -0.11476980149745941],
    [0.5114203095436096, 0.38155049085617065, -0.012271441519260406],
    [0.5247972011566162, 0.16832847893238068, -0.07390163838863373],
    [0.6567054390907288, 0.14114879071712494, -0.12972164154052734],
    [0.7569769024848938, 0.18760991096496582, -0.15829619765281677],
    [0.45730239152908325, 0.40455782413482666, -0.06279259920120239],
    [0.4749256372451782, 0.20843365788459778, -0.11606381088495255],
    [0.6123077869415283, 0.17374075949192047, -0.15592017769813538],
    [0.7163673639297485, 0.2001180648803711, -0.17383672297000885],
    [0.4187946319580078, 0.45309287309646606, -0.11511864513158798],
    [0.46486860513687134, 0.3094744384288788, -0.16275525093078613],
    [0.5668074488639832, 0.25537073612213135, -0.19016119837760925],
    [0.6573028564453125, 0.24700500071048737, -0.2028348594903946]
]

puntos_correctos_g = [
    (0.1499578356742859, 0.6198013424873352, -1.6216425535731105e-07),
    (0.17613589763641357, 0.43833181262016296, -0.008004576899111271),
    (0.2570781409740448, 0.32484087347984314, -0.0504334382712841),
    (0.30779772996902466, 0.20919263362884521, -0.09711851179599762),
    (0.3139668107032776, 0.11797559261322021, -0.15168972313404083),
    (0.5148491859436035, 0.43478336930274963, -0.07861003279685974),
    (0.7149568200111389, 0.4182559549808502, -0.1085120365023613),
    (0.8416110277175903, 0.4139935374259949, -0.13085253536701202),
    (0.9375828504562378, 0.41432759165763855, -0.14777396619319916),
    (0.5481654405593872, 0.5398985147476196, -0.08252143859863281),
    (0.6056079864501953, 0.5238259434700012, -0.08995019644498825),
    (0.5379288792610168, 0.5164309144020081, -0.06713094562292099),
    (0.4667598605155945, 0.5200623869895935, -0.056517478078603745),
    (0.5261738896369934, 0.6371786594390869, -0.08188432455062866),
    (0.5623214840888977, 0.6094244122505188, -0.07633541524410248),
    (0.4983066916465759, 0.6077373623847961, -0.03887565806508064),
    (0.42780402302742004, 0.6126453280448914, -0.021520067006349564),
    (0.4890967309474945, 0.7175819873809814, -0.08192101866006851),
    (0.5182593464851379, 0.6998245716094971, -0.06525479257106781),
    (0.46047893166542053, 0.6913840770721436, -0.024474676698446274),
    (0.4040120840072632, 0.6924404501914978, 0.003510069102048874),
]

puntos_correctos_t = [
    [0.47160711884498596, 0.7453329563140869, -7.851081136323046e-07],
    [0.5887063145637512, 0.6336497068405151, -0.05388583987951279],
    [0.625878095626831, 0.4529918432235718, -0.06589415669441223],
    [0.5539093017578125, 0.30751538276672363, -0.07730123400688171],
    [0.4943656325340271, 0.20446930825710297, -0.07762078195810318],
    [0.5797418355941772, 0.3346136808395386, -0.0036004793364554644],
    [0.5622715950012207, 0.16917453706264496, -0.08682048320770264],
    [0.5785694122314453, 0.21324625611305237, -0.1239948645234108],
    [0.5867289304733276, 0.3053106367588043, -0.12909509241580963],
    [0.47236886620521545, 0.36260661482810974, -0.005879884120076895],
    [0.44818636775016785, 0.208103746175766, -0.09742286801338196],
    [0.49348360300064087, 0.34383881092071533, -0.11378398537635803],
    [0.5182238817214966, 0.4281805753707886, -0.09352347254753113],
    [0.3772439956665039, 0.41236943006515503, -0.02323971688747406],
    [0.37965983152389526, 0.33146095275878906, -0.13010962307453156],
    [0.4279882609844208, 0.4765979051589966, -0.1131507083773613],
    [0.43753108382225037, 0.5321992039680481, -0.0665387213230133],
    [0.2830597162246704, 0.4770303964614868, -0.04323394224047661],
    [0.2991388738155365, 0.40373021364212036, -0.11042284220457077],
    [0.3458074629306793, 0.5033435821533203, -0.08567359298467636],
    [0.35072061419487, 0.5419090986251831, -0.04661396145820618]
]

puntos_correctos_o = [
    [0.460470974445343, 0.6115761995315552, -1.99245718590646e-07],
    [0.5833558440208435, 0.4867135286331177, 0.03592333197593689],
    [0.6417058110237122, 0.38588565587997437, 0.030848296359181404],
    [0.6884092092514038, 0.3088833689689636, -0.0015271441079676151],
    [0.664804220199585, 0.24657423794269562, -0.03146016597747803],
    [0.47370460629463196, 0.2625438868999481, 0.08277618885040283],
    [0.5183568000793457, 0.1352236419916153, 0.021733975037932396],
    [0.6206355094909668, 0.16412925720214844, -0.03687766566872597],
    [0.6712695956230164, 0.22082725167274475, -0.06696956604719162],
    [0.42532503604888916, 0.26826947927474976, 0.028624316677451134],
    [0.4886511266231537, 0.12080996483564377, -0.034907836467027664],
    [0.612666666507721, 0.1605025827884674, -0.0861019492149353],
    [0.6681684255599976, 0.23108555376529694, -0.10970886796712875],
    [0.38196998834609985, 0.2819401025772095, -0.03382379561662674],
    [0.45129647850990295, 0.13253694772720337, -0.0917874202132225],
    [0.5802335739135742, 0.16682952642440796, -0.11619117110967636],
    [0.6445733308792114, 0.2351933866739273, -0.11857577413320541],
    [0.35052919387817383, 0.31021848320961, -0.09579218924045563],
    [0.4406788945198059, 0.19952529668807983, -0.13796931505203247],
    [0.5457811951637268, 0.20008932054042816, -0.14920547604560852],
    [0.6119542121887207, 0.23435157537460327, -0.14880700409412384]
]


def comparar_puntos(mano_actual, puntos_correctos, tolerancia=0.3):
    for i, punto_correcto in enumerate(puntos_correctos):
        if not np.allclose([mano_actual[i].x, mano_actual[i].y, mano_actual[i].z], punto_correcto, atol=tolerancia):
            return False
    return True

def comparar_conjuntos_puntos(mano_actual, conjuntos_puntos_correctos, tolerancia=0.3):
    for index, conjunto in enumerate(conjuntos_puntos_correctos):
        if comparar_puntos(mano_actual, conjunto, tolerancia):
            print(f"Conjunto detectado: {index}")
            return index  # Devuelve el índice del conjunto detectado
    return -1 

conjuntos_puntos_correctos = [puntos_correctos_a, puntos_correctos_b, puntos_correctos_g, puntos_correctos_t, puntos_correctos_o]

@sock.route('/video-stream')
def video_stream(ws):
    while True:
        data = ws.receive()
        if data:
            # Decodificar frame
            np_frame = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            resultado = hands.process(rgb_frame)

            if resultado.multi_hand_landmarks:
                for hand_landmarks in resultado.multi_hand_landmarks:
                    # Dibujamos las conexiones de la mano
                    mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                    # Extraemos los puntos actuales de la mano
                    puntos_mano = hand_landmarks.landmark

                    conjunto_detectado = comparar_conjuntos_puntos(puntos_mano, conjuntos_puntos_correctos)
                    print(f"Conjunto detectado: {conjunto_detectado}")
                    if conjunto_detectado != -1:
                        if conjunto_detectado == 0:
                            ws.send("a")
                        elif conjunto_detectado == 1:
                            ws.send("b")
                        elif conjunto_detectado == 2:
                            ws.send("g")
                        elif conjunto_detectado == 3:
                            ws.send("t")
                        elif conjunto_detectado == 4:
                            ws.send("o")
                    else:
                        ws.send("Sin letra detectada")
        else:
            break
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

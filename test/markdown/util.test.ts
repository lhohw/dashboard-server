import { describe, test, expect } from "bun:test";
import { toBase64 } from "utils/serialize";

describe("base64 encode", () => {
  test("AB", () => {
    const str = "AB";
    const base64 = toBase64(str);
    const expected = "QUI=";
    expect(base64).toBe(expected);
  });
  test("str to base64", () => {
    const str = `Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.`;
    const base64 = toBase64(str);

    const expected = `TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=`;
    expect(base64).toBe(expected);
  });
  test("image", async () => {
    const nums = [
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 22,
      0, 0, 0, 22, 8, 6, 0, 0, 0, 196, 180, 108, 59, 0, 0, 10, 168, 105, 67, 67,
      80, 73, 67, 67, 32, 80, 114, 111, 102, 105, 108, 101, 0, 0, 72, 137, 149,
      151, 7, 84, 83, 233, 18, 128, 255, 123, 111, 58, 9, 45, 1, 233, 132, 222,
      164, 183, 0, 82, 66, 104, 1, 164, 119, 27, 33, 9, 16, 74, 8, 129, 32, 98,
      87, 22, 87, 112, 45, 136, 136, 96, 69, 87, 41, 10, 174, 74, 145, 181, 32,
      162, 216, 22, 5, 123, 221, 32, 139, 130, 178, 46, 22, 108, 168, 188, 11,
      28, 130, 187, 239, 188, 247, 206, 155, 115, 230, 204, 151, 201, 252, 51,
      243, 255, 231, 254, 247, 204, 5, 128, 162, 200, 17, 137, 50, 96, 69, 0,
      50, 133, 185, 226, 8, 127, 111, 122, 92, 124, 2, 29, 63, 8, 16, 160, 3,
      40, 192, 14, 32, 28, 110, 142, 136, 25, 22, 22, 12, 80, 153, 182, 127,
      151, 247, 119, 0, 52, 97, 111, 90, 78, 228, 250, 247, 255, 255, 171, 40,
      241, 248, 57, 92, 0, 160, 48, 148, 147, 120, 57, 220, 76, 148, 79, 160,
      250, 130, 43, 18, 231, 2, 128, 236, 69, 253, 6, 139, 115, 69, 19, 220,
      137, 50, 77, 140, 54, 136, 242, 189, 9, 78, 153, 226, 225, 9, 78, 154,
      100, 12, 152, 140, 137, 138, 96, 161, 76, 3, 128, 64, 230, 112, 196, 41,
      0, 144, 233, 168, 159, 158, 199, 77, 65, 243, 144, 189, 80, 182, 17, 242,
      4, 66, 148, 69, 40, 123, 100, 102, 102, 241, 80, 62, 138, 178, 41, 26,
      131, 250, 200, 19, 249, 25, 73, 223, 229, 73, 249, 91, 206, 36, 89, 78,
      14, 39, 69, 198, 83, 123, 153, 20, 130, 143, 32, 71, 148, 193, 89, 242,
      127, 30, 199, 255, 150, 204, 12, 201, 116, 13, 99, 84, 201, 169, 226, 128,
      8, 212, 42, 163, 103, 118, 47, 61, 43, 72, 198, 194, 164, 144, 208, 105,
      22, 240, 38, 227, 39, 57, 85, 18, 16, 61, 205, 220, 28, 86, 194, 52, 243,
      56, 62, 65, 178, 181, 25, 33, 193, 211, 156, 44, 240, 99, 203, 242, 228,
      178, 163, 166, 153, 159, 227, 27, 57, 205, 226, 172, 8, 89, 173, 100, 49,
      139, 57, 205, 28, 241, 76, 93, 73, 122, 180, 204, 159, 202, 103, 203, 242,
      23, 164, 70, 197, 78, 115, 158, 32, 38, 100, 154, 115, 210, 35, 131, 102,
      98, 88, 50, 191, 88, 18, 33, 235, 159, 47, 244, 247, 158, 169, 235, 39,
      219, 123, 102, 206, 119, 251, 21, 176, 101, 107, 115, 83, 163, 2, 100,
      123, 231, 204, 244, 207, 23, 50, 103, 114, 230, 196, 201, 122, 227, 241,
      125, 124, 103, 98, 162, 101, 241, 162, 92, 111, 89, 45, 81, 70, 152, 44,
      158, 159, 225, 47, 243, 231, 228, 69, 202, 214, 230, 162, 15, 228, 204,
      218, 48, 217, 25, 166, 113, 2, 195, 166, 25, 176, 64, 22, 200, 64, 85, 12,
      232, 32, 24, 253, 229, 3, 64, 46, 63, 63, 119, 98, 35, 172, 44, 209, 18,
      177, 32, 37, 53, 151, 206, 68, 111, 24, 159, 206, 22, 114, 173, 102, 211,
      237, 108, 236, 28, 0, 152, 184, 175, 83, 143, 195, 200, 245, 201, 123, 8,
      169, 43, 205, 248, 86, 199, 1, 48, 167, 116, 124, 124, 252, 228, 140, 47,
      132, 0, 64, 83, 56, 0, 36, 233, 140, 207, 36, 15, 0, 121, 109, 0, 46, 149,
      113, 37, 226, 188, 41, 223, 228, 93, 194, 2, 18, 80, 0, 52, 160, 142, 190,
      15, 12, 128, 41, 176, 68, 223, 9, 78, 192, 13, 120, 1, 95, 16, 8, 66, 65,
      20, 136, 7, 11, 1, 23, 164, 130, 76, 180, 243, 197, 96, 25, 88, 13, 138,
      64, 9, 216, 12, 182, 129, 74, 176, 7, 236, 7, 53, 224, 8, 56, 6, 90, 192,
      41, 112, 14, 92, 4, 87, 193, 13, 112, 27, 60, 4, 82, 48, 0, 94, 130, 17,
      240, 30, 140, 65, 16, 132, 135, 40, 16, 21, 82, 135, 116, 33, 35, 200, 2,
      178, 131, 24, 144, 7, 228, 11, 5, 67, 17, 80, 60, 148, 8, 165, 64, 66, 72,
      2, 45, 131, 214, 66, 37, 80, 41, 84, 9, 237, 131, 106, 161, 95, 160, 147,
      208, 57, 232, 50, 212, 3, 221, 135, 250, 160, 33, 232, 13, 244, 25, 70,
      96, 50, 76, 131, 181, 97, 99, 216, 26, 102, 192, 76, 56, 8, 142, 130, 23,
      192, 41, 112, 54, 92, 0, 23, 194, 27, 225, 10, 184, 26, 62, 12, 55, 195,
      231, 224, 171, 240, 109, 88, 10, 191, 132, 71, 17, 128, 200, 33, 170, 136,
      30, 98, 137, 48, 16, 22, 18, 138, 36, 32, 201, 136, 24, 89, 129, 20, 35,
      229, 72, 53, 210, 128, 180, 33, 93, 200, 77, 68, 138, 12, 35, 159, 48, 56,
      12, 21, 67, 199, 88, 98, 220, 48, 1, 152, 104, 12, 23, 147, 141, 89, 129,
      217, 128, 169, 196, 212, 96, 154, 49, 157, 152, 155, 152, 62, 204, 8, 230,
      27, 150, 130, 213, 194, 90, 96, 93, 177, 108, 108, 28, 54, 5, 187, 24, 91,
      132, 45, 199, 30, 196, 54, 97, 47, 96, 111, 99, 7, 176, 239, 113, 56, 156,
      42, 206, 4, 231, 140, 11, 192, 197, 227, 210, 112, 75, 113, 27, 112, 187,
      112, 141, 184, 118, 92, 15, 174, 31, 55, 138, 199, 227, 213, 241, 22, 120,
      119, 124, 40, 158, 131, 207, 197, 23, 225, 119, 224, 15, 227, 207, 226,
      123, 241, 3, 248, 143, 4, 57, 130, 46, 193, 142, 224, 71, 72, 32, 8, 9,
      107, 8, 229, 132, 58, 194, 25, 66, 47, 225, 57, 97, 140, 168, 72, 52, 34,
      186, 18, 67, 137, 60, 226, 18, 226, 38, 226, 1, 98, 27, 241, 58, 113, 128,
      56, 70, 82, 34, 153, 144, 220, 73, 81, 164, 52, 210, 106, 82, 5, 169, 129,
      116, 129, 244, 136, 244, 86, 78, 78, 78, 95, 206, 69, 46, 92, 78, 32, 183,
      74, 174, 66, 238, 168, 220, 37, 185, 62, 185, 79, 100, 101, 178, 57, 153,
      69, 158, 79, 150, 144, 55, 146, 15, 145, 219, 201, 247, 201, 111, 41, 20,
      138, 49, 197, 139, 146, 64, 201, 165, 108, 164, 212, 82, 206, 83, 158, 80,
      62, 202, 83, 229, 173, 228, 217, 242, 60, 249, 149, 242, 85, 242, 205,
      242, 189, 242, 175, 20, 136, 10, 70, 10, 76, 133, 133, 10, 5, 10, 229, 10,
      199, 21, 174, 43, 12, 43, 18, 21, 141, 21, 89, 138, 28, 197, 21, 138, 85,
      138, 39, 21, 239, 42, 142, 42, 81, 149, 108, 149, 66, 149, 50, 149, 54,
      40, 213, 41, 93, 86, 26, 84, 198, 43, 27, 43, 251, 42, 243, 148, 11, 149,
      247, 43, 159, 87, 238, 167, 34, 84, 3, 42, 139, 202, 165, 174, 165, 30,
      160, 94, 160, 14, 208, 112, 52, 19, 26, 155, 150, 70, 43, 161, 29, 161,
      117, 211, 70, 84, 148, 85, 28, 84, 98, 84, 242, 85, 170, 84, 78, 171, 72,
      85, 17, 85, 99, 85, 182, 106, 134, 234, 38, 213, 99, 170, 119, 84, 63,
      207, 210, 158, 197, 156, 197, 159, 181, 126, 86, 195, 172, 222, 89, 31,
      212, 52, 213, 188, 212, 248, 106, 197, 106, 141, 106, 183, 213, 62, 171,
      211, 213, 125, 213, 211, 213, 183, 168, 183, 168, 63, 214, 192, 104, 152,
      107, 132, 107, 44, 214, 216, 173, 113, 65, 99, 88, 147, 166, 233, 166,
      201, 213, 44, 214, 60, 166, 249, 64, 11, 214, 50, 215, 138, 208, 90, 170,
      181, 95, 235, 154, 214, 168, 182, 142, 182, 191, 182, 72, 123, 135, 246,
      121, 237, 97, 29, 85, 29, 47, 157, 52, 157, 50, 157, 51, 58, 67, 186, 84,
      93, 15, 93, 129, 110, 153, 238, 89, 221, 23, 116, 21, 58, 147, 158, 65,
      175, 160, 119, 210, 71, 244, 180, 244, 2, 244, 36, 122, 251, 244, 186,
      245, 198, 244, 77, 244, 163, 245, 215, 232, 55, 234, 63, 54, 32, 25, 48,
      12, 146, 13, 202, 12, 58, 12, 70, 12, 117, 13, 231, 26, 46, 51, 172, 55,
      124, 96, 68, 52, 98, 24, 165, 26, 109, 55, 234, 50, 250, 96, 108, 98, 28,
      107, 188, 206, 184, 197, 120, 208, 68, 205, 132, 109, 82, 96, 82, 111,
      242, 200, 148, 98, 234, 105, 154, 109, 90, 109, 122, 203, 12, 103, 198,
      48, 75, 55, 219, 101, 118, 195, 28, 54, 119, 52, 79, 53, 175, 50, 191,
      110, 1, 91, 56, 89, 8, 44, 118, 89, 244, 204, 198, 206, 118, 153, 45, 156,
      93, 61, 251, 174, 37, 217, 146, 105, 153, 103, 89, 111, 217, 103, 165,
      106, 21, 108, 181, 198, 170, 197, 234, 149, 181, 161, 117, 130, 245, 22,
      235, 46, 235, 111, 54, 142, 54, 25, 54, 7, 108, 30, 218, 42, 219, 6, 218,
      174, 177, 109, 179, 125, 99, 103, 110, 199, 181, 171, 178, 187, 101, 79,
      177, 247, 179, 95, 105, 223, 106, 255, 218, 193, 194, 129, 239, 176, 219,
      225, 158, 35, 213, 113, 174, 227, 58, 199, 14, 199, 175, 78, 206, 78, 98,
      167, 6, 167, 33, 103, 67, 231, 68, 231, 157, 206, 119, 25, 52, 70, 24, 99,
      3, 227, 146, 11, 214, 197, 219, 101, 165, 203, 41, 151, 79, 174, 78, 174,
      185, 174, 199, 92, 255, 114, 179, 116, 75, 119, 171, 115, 27, 156, 99, 50,
      135, 63, 231, 192, 156, 126, 119, 125, 119, 142, 251, 62, 119, 169, 7,
      221, 35, 209, 99, 175, 135, 212, 83, 207, 147, 227, 89, 237, 249, 212,
      203, 192, 139, 231, 117, 208, 235, 57, 211, 140, 153, 198, 60, 204, 124,
      229, 109, 227, 45, 246, 110, 242, 254, 192, 114, 101, 45, 103, 181, 251,
      32, 62, 254, 62, 197, 62, 221, 190, 202, 190, 209, 190, 149, 190, 79, 252,
      244, 253, 82, 252, 234, 253, 70, 252, 29, 253, 151, 250, 183, 7, 96, 3,
      130, 2, 182, 4, 220, 101, 107, 179, 185, 236, 90, 246, 72, 160, 115, 224,
      242, 192, 206, 32, 114, 80, 100, 80, 101, 208, 211, 96, 243, 96, 113, 112,
      219, 92, 120, 110, 224, 220, 173, 115, 31, 133, 24, 133, 8, 67, 90, 66,
      65, 40, 59, 116, 107, 232, 227, 48, 147, 176, 236, 176, 95, 195, 113, 225,
      97, 225, 85, 225, 207, 34, 108, 35, 150, 69, 116, 69, 82, 35, 23, 69, 214,
      69, 190, 143, 242, 142, 218, 20, 245, 48, 218, 52, 90, 18, 221, 17, 163,
      16, 51, 63, 166, 54, 230, 67, 172, 79, 108, 105, 172, 52, 206, 58, 110,
      121, 220, 213, 120, 141, 120, 65, 124, 107, 2, 62, 33, 38, 225, 96, 194,
      232, 60, 223, 121, 219, 230, 13, 204, 119, 156, 95, 52, 255, 206, 2, 147,
      5, 249, 11, 46, 47, 212, 88, 152, 177, 240, 244, 34, 133, 69, 156, 69,
      199, 19, 177, 137, 177, 137, 117, 137, 95, 56, 161, 156, 106, 206, 104,
      18, 59, 105, 103, 210, 8, 151, 197, 221, 206, 125, 201, 243, 226, 149,
      241, 134, 248, 238, 252, 82, 254, 243, 100, 247, 228, 210, 228, 193, 20,
      247, 148, 173, 41, 67, 169, 158, 169, 229, 169, 195, 2, 150, 160, 82, 240,
      58, 45, 32, 109, 79, 218, 135, 244, 208, 244, 67, 233, 227, 25, 177, 25,
      141, 153, 132, 204, 196, 204, 147, 66, 101, 97, 186, 176, 51, 75, 39, 43,
      63, 171, 71, 100, 33, 42, 18, 73, 179, 93, 179, 183, 101, 143, 136, 131,
      196, 7, 115, 160, 156, 5, 57, 173, 185, 52, 116, 48, 186, 38, 49, 149,
      252, 32, 233, 203, 243, 200, 171, 202, 251, 184, 56, 102, 241, 241, 124,
      165, 124, 97, 254, 181, 37, 230, 75, 214, 47, 121, 94, 224, 87, 240, 243,
      82, 204, 82, 238, 210, 142, 101, 122, 203, 86, 47, 235, 91, 206, 92, 190,
      111, 5, 180, 34, 105, 69, 199, 74, 131, 149, 133, 43, 7, 86, 249, 175,
      170, 89, 77, 90, 157, 190, 250, 183, 53, 54, 107, 74, 215, 188, 91, 27,
      187, 182, 173, 80, 187, 112, 85, 97, 255, 15, 254, 63, 212, 23, 201, 23,
      137, 139, 238, 174, 115, 91, 183, 231, 71, 204, 143, 130, 31, 187, 215,
      219, 175, 223, 177, 254, 91, 49, 175, 248, 74, 137, 77, 73, 121, 201, 151,
      13, 220, 13, 87, 126, 178, 253, 169, 226, 167, 241, 141, 201, 27, 187, 55,
      57, 109, 218, 189, 25, 183, 89, 184, 249, 206, 22, 207, 45, 53, 165, 74,
      165, 5, 165, 253, 91, 231, 110, 109, 46, 163, 151, 21, 151, 189, 219, 182,
      104, 219, 229, 114, 135, 242, 61, 219, 73, 219, 37, 219, 165, 21, 193, 21,
      173, 59, 12, 119, 108, 222, 241, 165, 50, 181, 242, 118, 149, 119, 85,
      227, 78, 173, 157, 235, 119, 126, 216, 197, 219, 213, 187, 219, 107, 119,
      195, 30, 237, 61, 37, 123, 62, 239, 21, 236, 189, 183, 207, 127, 95, 115,
      181, 113, 117, 249, 126, 220, 254, 188, 253, 207, 14, 196, 28, 232, 250,
      153, 241, 115, 237, 65, 141, 131, 37, 7, 191, 30, 18, 30, 146, 214, 68,
      212, 116, 214, 58, 215, 214, 214, 105, 213, 109, 170, 135, 235, 37, 245,
      67, 135, 231, 31, 190, 113, 196, 231, 72, 107, 131, 101, 195, 190, 70,
      213, 198, 146, 163, 224, 168, 228, 232, 139, 95, 18, 127, 185, 115, 44,
      232, 88, 199, 113, 198, 241, 134, 19, 70, 39, 118, 54, 81, 155, 138, 155,
      161, 230, 37, 205, 35, 45, 169, 45, 210, 214, 248, 214, 158, 147, 129, 39,
      59, 218, 220, 218, 154, 126, 181, 250, 245, 208, 41, 189, 83, 85, 167, 85,
      78, 111, 58, 67, 58, 83, 120, 102, 252, 108, 193, 217, 209, 118, 81, 251,
      240, 185, 148, 115, 253, 29, 139, 58, 30, 158, 143, 59, 127, 171, 51, 188,
      179, 251, 66, 208, 133, 75, 23, 253, 46, 158, 239, 98, 118, 157, 189, 228,
      126, 233, 212, 101, 215, 203, 39, 175, 48, 174, 180, 92, 117, 186, 218,
      124, 205, 241, 90, 211, 111, 142, 191, 53, 117, 59, 117, 55, 95, 119, 190,
      222, 122, 195, 229, 70, 91, 207, 156, 158, 51, 189, 158, 189, 231, 110,
      250, 220, 188, 120, 139, 125, 235, 234, 237, 144, 219, 61, 119, 162, 239,
      220, 187, 59, 255, 174, 244, 30, 239, 222, 224, 253, 140, 251, 175, 31,
      228, 61, 24, 123, 184, 234, 17, 246, 81, 241, 99, 197, 199, 229, 79, 180,
      158, 84, 255, 110, 246, 123, 163, 212, 73, 122, 186, 207, 167, 239, 218,
      211, 200, 167, 15, 251, 185, 253, 47, 255, 200, 249, 227, 203, 64, 225,
      51, 202, 179, 242, 231, 186, 207, 107, 7, 237, 6, 79, 13, 249, 13, 221,
      120, 49, 239, 197, 192, 75, 209, 203, 177, 225, 162, 63, 149, 254, 220,
      249, 202, 244, 213, 137, 191, 188, 254, 186, 54, 18, 55, 50, 240, 90, 252,
      122, 252, 205, 134, 183, 234, 111, 15, 189, 115, 120, 215, 49, 26, 54,
      250, 228, 125, 230, 251, 177, 15, 197, 31, 213, 63, 214, 124, 98, 124,
      234, 250, 28, 251, 249, 249, 216, 226, 47, 248, 47, 21, 95, 205, 190, 182,
      125, 11, 250, 246, 104, 60, 115, 124, 92, 196, 17, 115, 38, 71, 1, 4, 85,
      56, 57, 25, 128, 55, 135, 0, 160, 196, 3, 64, 189, 129, 206, 15, 243, 166,
      230, 233, 73, 129, 166, 190, 1, 38, 9, 252, 39, 158, 154, 185, 39, 197, 9,
      128, 6, 212, 76, 140, 69, 172, 118, 0, 142, 162, 106, 236, 133, 230, 70,
      53, 20, 213, 40, 47, 0, 219, 219, 203, 116, 122, 246, 157, 156, 211, 39,
      4, 135, 126, 177, 236, 181, 153, 160, 94, 221, 250, 124, 240, 15, 153,
      154, 225, 191, 235, 251, 159, 22, 76, 100, 117, 0, 255, 180, 255, 2, 50,
      152, 5, 159, 166, 161, 52, 65, 0, 0, 0, 138, 101, 88, 73, 102, 77, 77, 0,
      42, 0, 0, 0, 8, 0, 4, 1, 26, 0, 5, 0, 0, 0, 1, 0, 0, 0, 62, 1, 27, 0, 5,
      0, 0, 0, 1, 0, 0, 0, 70, 1, 40, 0, 3, 0, 0, 0, 1, 0, 2, 0, 0, 135, 105, 0,
      4, 0, 0, 0, 1, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 144, 0, 0, 0, 1, 0, 0, 0,
      144, 0, 0, 0, 1, 0, 3, 146, 134, 0, 7, 0, 0, 0, 18, 0, 0, 0, 120, 160, 2,
      0, 4, 0, 0, 0, 1, 0, 0, 0, 22, 160, 3, 0, 4, 0, 0, 0, 1, 0, 0, 0, 22, 0,
      0, 0, 0, 65, 83, 67, 73, 73, 0, 0, 0, 83, 99, 114, 101, 101, 110, 115,
      104, 111, 116, 178, 251, 18, 188, 0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 22,
      37, 0, 0, 22, 37, 1, 73, 82, 36, 240, 0, 0, 1, 212, 105, 84, 88, 116, 88,
      77, 76, 58, 99, 111, 109, 46, 97, 100, 111, 98, 101, 46, 120, 109, 112, 0,
      0, 0, 0, 0, 60, 120, 58, 120, 109, 112, 109, 101, 116, 97, 32, 120, 109,
      108, 110, 115, 58, 120, 61, 34, 97, 100, 111, 98, 101, 58, 110, 115, 58,
      109, 101, 116, 97, 47, 34, 32, 120, 58, 120, 109, 112, 116, 107, 61, 34,
      88, 77, 80, 32, 67, 111, 114, 101, 32, 54, 46, 48, 46, 48, 34, 62, 10, 32,
      32, 32, 60, 114, 100, 102, 58, 82, 68, 70, 32, 120, 109, 108, 110, 115,
      58, 114, 100, 102, 61, 34, 104, 116, 116, 112, 58, 47, 47, 119, 119, 119,
      46, 119, 51, 46, 111, 114, 103, 47, 49, 57, 57, 57, 47, 48, 50, 47, 50,
      50, 45, 114, 100, 102, 45, 115, 121, 110, 116, 97, 120, 45, 110, 115, 35,
      34, 62, 10, 32, 32, 32, 32, 32, 32, 60, 114, 100, 102, 58, 68, 101, 115,
      99, 114, 105, 112, 116, 105, 111, 110, 32, 114, 100, 102, 58, 97, 98, 111,
      117, 116, 61, 34, 34, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
      120, 109, 108, 110, 115, 58, 101, 120, 105, 102, 61, 34, 104, 116, 116,
      112, 58, 47, 47, 110, 115, 46, 97, 100, 111, 98, 101, 46, 99, 111, 109,
      47, 101, 120, 105, 102, 47, 49, 46, 48, 47, 34, 62, 10, 32, 32, 32, 32,
      32, 32, 32, 32, 32, 60, 101, 120, 105, 102, 58, 80, 105, 120, 101, 108,
      89, 68, 105, 109, 101, 110, 115, 105, 111, 110, 62, 50, 50, 60, 47, 101,
      120, 105, 102, 58, 80, 105, 120, 101, 108, 89, 68, 105, 109, 101, 110,
      115, 105, 111, 110, 62, 10, 32, 32, 32, 32, 32, 32, 32, 32, 32, 60, 101,
      120, 105, 102, 58, 80, 105, 120, 101, 108, 88, 68, 105, 109, 101, 110,
      115, 105, 111, 110, 62, 50, 50, 60, 47, 101, 120, 105, 102, 58, 80, 105,
      120, 101, 108, 88, 68, 105, 109, 101, 110, 115, 105, 111, 110, 62, 10, 32,
      32, 32, 32, 32, 32, 32, 32, 32, 60, 101, 120, 105, 102, 58, 85, 115, 101,
      114, 67, 111, 109, 109, 101, 110, 116, 62, 83, 99, 114, 101, 101, 110,
      115, 104, 111, 116, 60, 47, 101, 120, 105, 102, 58, 85, 115, 101, 114, 67,
      111, 109, 109, 101, 110, 116, 62, 10, 32, 32, 32, 32, 32, 32, 60, 47, 114,
      100, 102, 58, 68, 101, 115, 99, 114, 105, 112, 116, 105, 111, 110, 62, 10,
      32, 32, 32, 60, 47, 114, 100, 102, 58, 82, 68, 70, 62, 10, 60, 47, 120,
      58, 120, 109, 112, 109, 101, 116, 97, 62, 10, 201, 2, 159, 109, 0, 0, 0,
      28, 105, 68, 79, 84, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 40, 0,
      0, 0, 11, 0, 0, 0, 11, 0, 0, 0, 89, 105, 181, 229, 147, 0, 0, 0, 37, 73,
      68, 65, 84, 72, 13, 98, 252, 15, 4, 12, 36, 128, 3, 7, 14, 16, 165, 154,
      113, 212, 96, 88, 56, 141, 6, 5, 44, 36, 24, 70, 131, 130, 246, 65, 1, 0,
      0, 0, 255, 255, 251, 216, 35, 240, 0, 0, 0, 35, 73, 68, 65, 84, 99, 252,
      15, 4, 12, 36, 128, 3, 7, 14, 16, 165, 154, 113, 212, 96, 88, 56, 141, 6,
      5, 44, 36, 24, 70, 131, 130, 246, 65, 1, 0, 84, 105, 137, 63, 60, 61, 2,
      147, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
    ];
    const base64 = toBase64(nums);
    const expected = `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`;
    expect(base64).toBe(expected);
  });
});
